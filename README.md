# Threema Backup Viewer

## First things first

Threema is a trademark of https://threema.ch/ and this tool is not connected in any ways with this great messenger and company.❤️

‼I only used the word "Threema" to make clear, that this tool should only be used to view backups made with Threema.‼

I tried my best to code the project to work with backups back from 2018 but I will not garuantee that this will work.
Especially the fact that I'm located in Germany and my backups contain German related syntax could cause problems with other regional settings on your phone.

Therefore please check your chat message.txt file for your localized timezone and so on and adjust ```localeStrings``` to match your needs.

## How to run this

terminal -> locate your project on your file system

```
npm install
npm run dev
adjust your localeStrings and save
```
This will spawn an dev server on port 4000 🚀️ (which can also be used to debug the project with Chrome).

You can now open up a backup by selecting all files on the folder. The tool will separate images, attachments from the chat itself.

## Final notes

Honestly I personally don't get:thinking: it why Threema offers a possibility to create a backup of a chat and then they use a such dumb format like txt to store the messages. Why not using a json :heart: as well instead of rough txt files :broken_heart:? 😕 Just my two cents.

And Threema:wave:: if you read this: please offer an professional way to export chats as well.:pray: This should not be that hard. So please give it a try, okay?:kissing_heart:
