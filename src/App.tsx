import React, { useState } from 'react';
import './App.css';

interface iMessage {
  direction: string;
  timeStamp: string;
  message: string;
}

interface iImage {
name: string;
data: File;
}

function updateImagesMap(index: number, file: File, images: { [id: number]: iImage }, setImages: React.Dispatch<React.SetStateAction<{ [id: number]: iImage }>>) {
  setImages((prevImages: { [id: number]: iImage }) => ({
    ...prevImages,
    [index]: { name: file.name, data: file }
  }));
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
    console.log("Image not found: " + imageName);
  }
}

const App: React.FC = () => {
  const [chatFile, setFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string[]>([]);
  const [messages, setMessages] = useState<{ [id: number]: iMessage }>({});
  const [images, setImages] = useState<{ [id: number]: iImage }>({});
  var showImages = false;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      var selectedChatFile: File | null = null;
      const files = event.target.files;
      var imageCount = 1;

      //iterate over the files and seperate the chat file from the images and other files
      for (let i = 0; i < files.length; i++) {
        
        const file = files[i];
        if (file.name.includes(".txt")) {
          selectedChatFile = file;
          setFile(selectedChatFile);
        }
        else{
          if(file.name.includes(".jpg") || file.name.includes(".jpeg")){
            updateImagesMap(imageCount, file, images, setImages);
            showImages = true;
            imageCount++;          
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

         

          //Github Copilot makes a shorter version out of this but it is hard to read
          //Threema made some changes in the past related to the time stamps (MEZ, MESZ) -> Germany. This will be different in other countries
            let separator = "";
            if (lineTemp.includes("MEZ: ")) {
            separator = "MEZ: ";
            } else if (lineTemp.includes("MESZ: ")) {
            separator = "MESZ: ";
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
          
            //image handling
            if (message.includes(".jpg") || message.includes(".jpeg")) {
                message = message.replace("Bild (", "");
                message = message.replace("Datei: ", "");
                message = message.replace(")", "");

            }
            
            if (line === "") {
              direction="invisible";
            }

            newMessages[id] = { direction, timeStamp, message };
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
        <div>
          <h3>Selected Threema chat file:</h3>
          
            {Object.values(messages).map((msg) => (
              
                <div className={msg.direction}>  
                  <div className='timeStamp'>{msg.timeStamp} </div>
                    {msg.message.includes(".jpg") || msg.message.includes(".jpeg") ? (
                      <img className="chatImage" src={getDataUrlFromImageName(msg.message, images)} alt={msg.message} />
                    ) : (
                      <div className='message'>{msg.message}</div>
                    )}
                  </div>
            ))}
          </div>
      )}
    </div>
  );
};

export default App;