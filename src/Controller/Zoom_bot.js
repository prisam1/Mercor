        const  ZoomSDK  = require('zoomus')
        const { SpeechClient } = require('@google-cloud/speech')
        const { OpenAIApi } = require("openai")
        const textToSpeech = require('@google-cloud/text-to-speech')
        const secret = require('../client_secret_18577759840-hrc66r6ekio00lfhsuhc269t4clamak6.apps.googleusercontent.com.json')
       
        const zoom = new ZoomSDK({
          key: '35W9PdURsqLE2t4eyxwtA',
          secret: '5KeSWSuHR2ZLYHlZOWWQfzXw6rbu76k6'
        });
        
        const speechClient = new SpeechClient({
          projectId: 'infinite-loader-379113',
          keyFilename: secret
        });
        const credentials = {
          projectId: 'infinite-loader-379113',
          keyFilename: secret,
        };
        
        
        function extractMeetingIdFromLink(link) {
          const regex = /(?:\/j\/|\/my\/|\/join\?)[^/]*\/(\w+)/i
          const match = link.match(regex);
          if (match && match[1]) {
            return match[1]
          } else {
            throw new Error('Invalid Zoom meeting link')
          }
        }

        const joinZoomMeeting = async (req,res) => {
           try {
            const { meetingLink } = req.body
            const meetingId = extractMeetingIdFromLink(meetingLink)
         const meeting = await zoom.meeting.get({ meetingId })
         const joinUrl = meeting.join_url  
    
          window.open(joinUrl, '_blank')         
          console.log('Joined Zoom meeting:', meetingId)
            return meetingId
       }
       catch (error) {
        console.error('Failed to join Zoom meeting:', error)
       return res.status(500).json({ error: 'Failed to join Zoom meeting' })
      }}
        

const convertSpeechToText = async (req, res) => {
  try {
    const recognizeStream = speechClient
      .streamingRecognize({
        config: {
          encoding: 'LINEAR16',
          sampleRateHertz: 16000,
          languageCode: 'en-US'
        },  
        interimResults: true
      })
      .on('error', (error) => {
        console.error('Speech-to-text error:', error)
        res.status(500).json({ error: 'Failed to convert speech to text' })
      })
      .on('data', async (data) => {
        const transcript = data.results[0].alternatives[0].transcript;
        console.log('Transcript:', transcript);
        const response = await gpt.complete({
          prompt: transcript,
          maxTokens: 3000
        });
        const audioContent = await convertTextToSpeech(response.choices[0].text)

        zoomWebSocket.send(audioContent);
      });

    const zoomWebSocket = new WebSocket('wss://zoom-server-url')

    zoomWebSocket.on('open', () => {
      console.log('WebSocket connection established with Zoom')
    });

    zoomWebSocket.on('message', (audioData) => {
      recognizeStream.write(audioData);
    })

    zoomWebSocket.on('close', () => {
      recognizeStream.end();
      console.log('WebSocket connection with Zoom closed')
    });

    res.json({ message: 'Audio streaming and conversion started' })
  } 
  catch (error) {
    console.error('Failed to stream audio and convert to text:', error)
    res.status(500).json({ error: 'Failed to stream audio and convert to text' })
  }
}

  const client = new textToSpeech.TextToSpeechClient({ credentials })

  async function convertTextToSpeech(text, languageCode = 'en-US', voiceName = 'en-US-Standard-D', speakingRate = 1.0) {
    const request = {
      input: { text },
      voice: { languageCode, name: voiceName },
      audioConfig: { audioEncoding: 'MP3', speakingRate },
    };
  
    const [response] = await client.synthesizeSpeech(request)
    return response.audioContent
}
      
          
    const processGPT = async (req, res) => {
      try{
        const openai = new OpenAIApi('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');
        const text = req.body.text 
        const Completion = await openai.createChatCompletion({
              model: "gpt-3.5-turbo",      
              prompt: text,
              maxTokens: 3000
        });
        console.log(Completion.data.choices[0].text)
    
   
         } catch (error) {
            console.error('Failed to process GPT:', error)
            res.status(500).json({ error: 'Failed to process GPT' })
          }
        }
        
   const generateSpeechFromText = async (req, res) => {
          try {
            const text = req.body.text
        
            const audioContent = await convertTextToSpeech(text)

            res.send(audioContent);
            res.json({ audioContent: 'Sample audio content' })
          } catch (error) {
            console.error('Failed to convert text to speech:', error)
            res.status(500).json({ error: 'Failed to convert text to speech' })
          }
        }
         

 module.exports={convertSpeechToText,joinZoomMeeting,processGPT,generateSpeechFromText}
        


    
   