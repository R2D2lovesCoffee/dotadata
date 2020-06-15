import React from 'react';
import '../components/views/Home.css';
import ReactAudioPlayer from 'react-audio-player';

export default function Subject(props) {

    switch (props.type) {
        case 'audio':
            return (
                <div className="container" id='special'>
                    <ReactAudioPlayer className="container embed-responsive-item" controls src={props.content} autoPlay={true} />
                </div>
            )
        case 'img':
            return (<div className="container" id='special'>
                <img className='centerImage' alt='alternative' src={props.content} />
            </div>)
        case 'text':
            return (<div className="container" id='special' id='textAns'>
                {props.content}
            </div>)
        case 'none':
            return (<div></div>)
        default:
            return (
                <div className="container">Subject type not recognized</div>
            )
    }
}