import React from 'react'
import { Link } from 'react-router-dom'

export const About: React.FC = () => {
  return (
    <div>
      <p>
        Fretboard dot cool is an app intended to help you learn, explore, and
        internalize the scale and chord patterns on your instrument's fretboard.
      </p>
      <p>
        Fretboard dot cool is open-source. You can view the code on <a href="https://github.com/uhoh-itsmaciek/fretboard.cool" rel="nofollow">github</a>.
        If you don't write code, you can still contribute by spreading the word,
        reporting problems, or making suggestions.
      </p>
      <p>
        by Maciek Sakrejda
      </p>
      <small>
        Sound playback via FluidR3 sound font • Creative Commons Attribution 3.0 License
      </small>
      <p>
        <Link to='/'>&lt; back</Link>
      </p>
    </div>
  )
}
