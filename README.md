# Threema Backup Viewer

## First things first

Threema is a trademark of https://threema.ch/ and this tool is not connected in any ways with this great messenger and company.❤️ 

I only used the word "Threema" to make clear, that this tool should only be used to view backups made with Threema.

I tried my best to code the project to work with backups back from 2018 but I will not garuantee that this will work.
Especially the fact that I'm located in Germany and my backups contain German related syntax could cause problems with other regional settings on your phone.

## How to run this

terminal -> locate your project on your file system

```
npm install
npm run dev
```

This will spawn an dev server on port 4000 🚀️ (which can also be used to debug the project with Chrome).

## Final notes

Honestly I personally don't get it why Threema offers a possibility to create a backup of a chat and then they use a such dumb format like txt to store the messages. Why not using a json as well? 😕 
As the files contain a lot of regional related things like timezones, descriptions below pictures and so on I expect the code to crash on English Threema backups. I will change it if there is any request to do so (some lines of code as an example might be nice then).

And Threema: if you read this: please offer an professional way to export chats as well. This should not be that hard. So please give it a try, okay?
