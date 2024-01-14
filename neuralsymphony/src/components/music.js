import React, {  state, useState,  useRef,  useEffect } from 'react';

const Music = () => {
  const [musicList, setMusicList] = useState([
    {
      name: 'Young & Beautiful',
      image: 'https://images.genius.com/05147118c2c2de36f114f182f89bf880.1000x1000x1.jpg',
      audioFile: require('../audio/Lana del rey - Young & Beautiful.mp3'),
    },
    {
      name: 'Say Yes to Heaven',
      image: 'https://lastfm.freetls.fastly.net/i/u/ar0/5d9d356ea01c82c7684e443d89dca7de.jpg',
      audioFile: require('../audio/Lana del rey - yes to heaven.mp3'),
    },
    {
      name: 'Summertime Sadness',
      image: 'https://i.ytimg.com/vi/TdrL3QxjyVw/maxresdefault.jpg',
      audioFile: require('../audio/Lana del rey - summertime sadness.mp3'),
    },
    {
      name: 'Born To Die',
      image: 'https://m.media-amazon.com/images/I/717Typ0LtTL._UF894,1000_QL80_.jpg',
      audioFile: require('../audio/Lana del rey - Born To Die.mp3'),
    },
    {
      name: 'Blue Jeans',
      image: 'https://f4.bcbits.com/img/a3328598993_65',
      audioFile: require('../audio/Lana del rey - Blue Jeans.mp3'),
    }
  ]);

    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

    const handleNextTrack = () => {
      setCurrentTrackIndex((prev) => (prev + 1) % musicList.length);

    };

    return (
      <div className="Music">
        <div className='row mx-3 my-3 parentSection'>
          {musicList.map((music, index) => (
            <div key={index} className='col-2 mx-3 section'>
              <h4>{music.name}</h4><br/>
              <img src={music.image} className='col-9' alt={music.name} />
              {/* Assuming you have a MusicPlayer component */}
              <MusicPlayer audioFile={music.audioFile} musicList={musicList} 
              index = {index}
              currentTrackIndex={index}
              setCurrentTrackIndex={setCurrentTrackIndex}
              onNextTrack={handleNextTrack}
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

const MusicPlayer = ({ musicList, audioFile, index, currentTrackIndex, setCurrentTrackIndex, onNextTrack }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const playIcon = require('../images/playIcon.png');
  const pauseIcon = require('../images/pauseIcon.png');
  const prevIcon = require('../images/prevIcon.png');
  const nextIcon = require('../images/nextIcon.png');

  useEffect(() => {
    const audioElement = audioRef.current;
  
    audioElement.addEventListener('loadedmetadata', () => {
      setDuration(audioElement.duration);
    });
  
    audioElement.addEventListener('timeupdate', () => {
      setCurrentTime(audioElement.currentTime);
    });
  
    audioElement.addEventListener('ended', () => {
      // Handle the end of the audio
      setIsPlaying(false);
      setCurrentTime(0);
  
      
    });
  
    // Cleanup event listeners when the component unmounts
    return () => {
      audioElement.removeEventListener('loadedmetadata', () => {});
      audioElement.removeEventListener('timeupdate', () => {});
      audioElement.removeEventListener('ended', () => {});
    };
  }, [currentTrackIndex, musicList, audioFile]);

  const togglePlay = () => {
    const audioElement = audioRef.current;

    if (isPlaying) {
      audioElement.pause();
    } else {
      audioElement.play();
      console.log("Playing: " + currentTrackIndex);
    }

    setIsPlaying(!isPlaying);
  };


  // const handlePrevious = () => {
  //   if (trackIndex === 0) {
  //     let lastTrackIndex = musicList.length - 1;
  //     setTrackIndex(lastTrackIndex);
  //     setCurrentTrackIndex(musicList[lastTrackIndex]);
  //   } else {
  //     setTrackIndex((prev) => prev - 1);
  //     setCurrentTrackIndex(musicList[trackIndex - 1]);
  //   }
  //   setIsPlaying(true);

  // };
  
  // const handleNext = () => {
  //   if (currentTrackIndex >= musicList.length - 1) {
  //     setCurrentTrackIndex(0);
  //   } else {
  //     console.log('Current: ' + currentTrackIndex);
  //     setCurrentTrackIndex((prevIndex) => prevIndex + 1);
  //     console.log('Next: ' + (currentTrackIndex + 1));
  //   }
  
  //   const audioElement = audioRef.current;
  //   console.log('audio info' + audioRef.current)
  //   audioElement.src = musicList[currentTrackIndex].audioFile; // Update the audio source
  //   audioElement.play();
  //   onNextTrack(); // Notify the parent component about the next track
  // };


  const handleNext = () => {
    // Calculate the index of the next track
    var nextIndex = (currentTrackIndex + 1) % musicList.length;
  
    // Update the current track index to the next index
    setCurrentTrackIndex(nextIndex);
    

    // Pause the current music before playing next
    audioRef.current.pause();
    
    // Access the audio element directly and then get its audioRef
    var audioElement = document.getElementById(`audio-${nextIndex}`);
    
    // Check if the audioRef is found
    if (audioElement) {
      // Update the audio source and play the next track
      console.log(`audio-${nextIndex}`);
      audioElement.play();
    } else {
      console.error(`Audio element with ID 'audio-${nextIndex}' not found.`);
    }
    // Notify the parent component about the next track
    onNextTrack();
  };
  

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const handleProgressBarClick = (e) => {
    const progressBar = e.currentTarget;
    const clickPosition = e.clientX - progressBar.getBoundingClientRect().left;
    const progressBarWidth = progressBar.clientWidth;

    const newTime = (clickPosition / progressBarWidth) * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  return (
    <div className="music-player">
      {/* Previous button */}
      <img src={prevIcon} alt="Previous" id="icon" />

      {/* Play/Pause button */}
      <img src={isPlaying ? pauseIcon : playIcon} alt="Play/Pause" onClick={togglePlay} id="icon" />

      {/* Next button */}
      <img src={nextIcon} alt="Next" onClick={handleNext} id="icon" /><br />

      {/* Current time and duration */}
      <b>{formatTime(currentTime)} / {formatTime(duration)}</b>

      {/* Audio element */}
      <audio ref={audioRef} controls={false} id={`audio-${index}`}>
        <source src={audioFile} type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>

      {/* Line moving for tracking minute of music timing */}
      <div className="progress-bar" onClick={handleProgressBarClick}  style={{ backgroundColor: 'black' }}>
        <div className="progress" style={{ width: `${(currentTime / duration) * 100}%`, height: '7px', backgroundColor: 'white'}}></div>
      </div>
      
    </div>
  );
};

export default Music;
