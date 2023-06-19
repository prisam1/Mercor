import React, { useState } from 'react'
import axios from 'axios'

const App = () => {
  const [meetingLink, setMeetingLink] = useState('')
  const [transcript, setTranscript] = useState('')
  const [response, setResponse] = useState('')

  const joinZoomMeeting = async () => {
    try {
      await axios.post('/joinZoomMeeting', { meetingLink })
      console.log('Successfully joined Zoom meeting')
    } catch (error) {
      console.error('Failed to join Zoom meeting:', error)
    }
  };

  const handleSpeechToText = async (audioData) => {
    try {
      const response = await axios.post('/speechToText', { audioData })
      const transcript = response.data.transcript
      setTranscript(transcript)
    } catch (error) { 
      console.error('Failed to convert audio to text:', error)
    }
  };

  const handleProcessText = async () => {
    try {
      const response = await axios.post('/processGPT', { text: transcript })
      const gptResponse = response.data.response
      setResponse(gptResponse)
    } catch (error) {
      console.error('Failed to process text with GPT:', error)
    }
  };
  const handleTextToSpeech = async () => {
    try {
      const resp = await axios.post('/textToSpeech', { text: response });
      const audioContent = resp.data;
      
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()

    const audioData = Uint8Array.from(atob(audioContent), c => c.charCodeAt(0)).buffer

    const decodedAudio = await audioContext.decodeAudioData(audioData)

    const audioSource = audioContext.createBufferSource()
    audioSource.buffer = decodedAudio;

    audioSource.connect(audioContext.destination)

    audioSource.start(0)
    } catch (error) {
      console.error('Failed to convert text to speech:', error)
    }
  };

  return (
    <div>
      <h1>Zoom Bot</h1>
      <input
        type="text"
        placeholder="Enter Zoom meeting link"
        value={meetingLink}
        onChange={(e) => setMeetingLink(e.target.value)}
      />
      <button onClick={joinZoomMeeting}>Join Zoom Meeting</button>
      <br/><br/>
      <div>
        <button onClick={handleSpeechToText}>Convert Zoom Audio to Text</button><br/><br/>
      </div>

      <div>
        <button onClick={handleProcessText}>Process Text with GPT</button><br/><br/>
      </div>
  
      <div>
         <button onClick={handleTextToSpeech}>Convert to Speech</button>
      </div>
    </div>
  );
};

export default App
