import React, {useState } from 'react';
import './App.css';


interface iMessage {
  direction: string;
  timeStamp: string;
  message: string;
  messageID?: string;
  description?: string;
}

interface iImage {
name: string;
data: File;
}

interface iAttachment{
name: string;
data: File;
}

// enum for the locale strings
// Please check the blank spaces at the end of the strings. They are important for the correct splitting of the message
enum localeStrings {
  IMAGE = "Bild",
  FILE = "Datei: ",
  TIMEZONE_SHORT = "MEZ: ",
  TIMEZONE_LONG = "MESZ: ",
  SUBTITLE = "Untertitel",
}


function updateImagesMap(index: number, file: File, images: { [id: number]: iImage }, setImages: React.Dispatch<React.SetStateAction<{ [id: number]: iImage }>>) {
  setImages((prevImages: { [id: number]: iImage }) => ({
    ...prevImages,
    [index]: { name: file.name, data: file,  }
  }));
}

function updateAttachmentMap(index: number, file: File, attachment: { [id: number]: iImage }, setAttachments: React.Dispatch<React.SetStateAction<{ [id: number]: iAttachment }>>) {
  setAttachments((prevAttachments: { [id: number]: iImage }) => ({
    ...prevAttachments,
    [index]: { name: file.name, data: file,  }
  }));
}

function renderMessage(message: String) {
  message = message.trim();
  if (message.length > 0) {
    if (!message.includes(".vcf") || !message.includes(".pdf") || !message.includes(".jpg") || !message.includes(".jpeg")) {
    return <div className='message'>{message}</div>;
    }
    else {
      return "";
    } 
  }
}

function messageHasRenderableContent(message: iMessage){
  if(message.message.length > 0){
    return true;
  }
  else{
    return false;
  }
}


function getDataUrlFromImageName(imageName: string, images: { [id: number]: iImage }) {
  if (Object.values(images).some(foundImage => foundImage.name.includes(imageName))) {
    const image = Object.values(images).find(image => image.name === imageName);
    if (image) {
      var dataUrl = URL.createObjectURL(image.data);
      return dataUrl;
    }
  }
  else {  
  }
}

function getDataUrlFromAttachment(attachmentName: string, attachments: { [id: number]: iAttachment }) {
  if (Object.values(attachments).some(foundAttachment => foundAttachment.name.includes(attachmentName))) {
    const image = Object.values(attachments).find(attachment => attachment.name === attachmentName);
    if (image) {
      var dataUrl = URL.createObjectURL(image.data);
      return dataUrl;
    }
  }
  else {  
  }
}


const App: React.FC = () => {
  const [chatFile, setFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string[]>([]);
  const [messages, setMessages] = useState<{ [id: number]: iMessage }>({});
  const [images, setImages] = useState<{ [id: number]: iImage }>({});
  const [attachments, setAttachments] = useState<{ [id: number]: iAttachment }>({});

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      var selectedChatFile: File | null = null;
      const files = event.target.files;
      var counter = 1;
      

      //iterate over the files and seperate the chat file from the images and other files
      for (let i = 0; i < files.length; i++) {
        
        const file = files[i];
        if (file.name.includes(".txt")) {
          selectedChatFile = file;
          setFile(selectedChatFile);
        }
        else{
          if(file.name.includes(".jpg") || file.name.includes(".jpeg")){
            updateImagesMap(counter, file, images, setImages);
            counter++;          
          }
          else {
            updateAttachmentMap(counter, file, attachments, setAttachments);
            counter++;          
          }
        } 
        
      }

      //handling the chat file itself
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const lines = text.split('\n');
        setFileContent(lines);

        const newMessages: { [id: number]: iMessage } = {};
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          

          const id = i;
          var direction = ""; 

          const lineTemp = line.replace(">>>", "");
          var message = "";
          var timeStamp = "";
          var messageID = i;
          var messageTokens = null;
          var description = null;
          

          // Github Copilot makes a shorter version out of this but it is hard to read
          // Threema made some changes in the past related to the time stamps (MEZ, MESZ) -> Germany. This will be different in other countries
          // please check the ENUM localeStrings for the correct strings
            let separator = "";
            if (lineTemp.includes(localeStrings.TIMEZONE_SHORT)) {
            separator = localeStrings.TIMEZONE_SHORT;
            } else if (lineTemp.includes(localeStrings.TIMEZONE_LONG)) {
            separator = localeStrings.TIMEZONE_LONG;
            }

            if (separator) {
              const [time, msg] = lineTemp.split(separator);
              timeStamp = time.trim();
              message = msg.trim();
            } else {
              timeStamp = "";
              message = lineTemp;
            }

            if (line.includes(">>>")) {
              direction = "sent";
              timeStamp = timeStamp.replace(">>>", "");
            } else if (line.includes("<<<")) {
              direction = "received";
              timeStamp = timeStamp.replace("<<<", "");
            } else {
              direction = newMessages[id - 1]?.direction || "";
            }

            //attachment handling
            if (message.includes(localeStrings.FILE)) {
              messageTokens = message.split(localeStrings.FILE);
              message = messageTokens[1].trim();
              messageID = i;
            }
          
            //image handling
            if (message.includes(".jpg") || message.includes(".jpeg")) {
                message = message.replace(localeStrings.IMAGE + " (", "");
                message = message.replace(localeStrings.FILE, "");
                message = message.replace(")", "");
            }
            if (message.includes(localeStrings.SUBTITLE))
            {
              
              messageTokens = message.split(localeStrings.SUBTITLE);
              message = messageTokens[0].trim();
              description = messageTokens[1].trim();
            }
            
            newMessages[id] = { direction, timeStamp, message, messageID: messageID.toString(), description: description || undefined };
        }
        
        setMessages(newMessages);
      };

      reader.readAsText(selectedChatFile as File);
    }
  };

  return (
    <div>
      <input multiple type="file" className="inputfile" onChange={handleFileChange} />
      
      {chatFile && <p>Selected file: {chatFile.name}</p>}
      {fileContent.length > 0 && (
        <div >
          <h3>Selected Threema chat file:</h3> 
            {Object.values(messages).map((msg) => (
              messageHasRenderableContent(msg) &&
                <div className={msg.direction} key={msg.messageID}>
                   
                  <div className='timeStamp'>{msg.timeStamp}</div>
                  
                    {msg.message.includes(".jpg") || msg.message.includes(".jpeg") ? (
                      <img className="chatImage" src={getDataUrlFromImageName(msg.message, images)} alt={msg.message} />
                    ) : null
                    }
                    
                    {msg.message.includes(".vcf") || msg.message.includes(".pdf") ? (
                      <div className="mediaAttachment">
                        <a className="attachmentLink" href={getDataUrlFromAttachment(msg.message, attachments)}>
                          <img className="fileAttachment"></img>
                        </a>
                      </div>
                    ) : (
                      null
                    )}

                    {renderMessage(msg.message)}
                    <p className="description">{msg.description !== undefined ? msg.description: null}</p>

                </div>
            ))}
          </div>
      )}
    </div>
  );
};

export default App;