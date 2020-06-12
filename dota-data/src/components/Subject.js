import React, { useEffect, useRef } from 'react';
import '../components/views/Home.css';

export default function Subject(props) {
    const audio = useRef(null);
    useEffect(() => {
        if (props.type === 'audio' && props.content) {
            audio.current.pause();
            audio.current.load();
            audio.current.play();
        }
    }, [props.type, props.content])
    switch (props.type) {
        case 'audio':
            return (
                <div className="container" id='special'>
                    <audio controls className="container embed-responsive-item" ref={audio}>
                        <source src={props.content} type="audio/mpeg" />
                        Your browser does not support the audio element.
                    </audio>
                </div>
            )
        case 'img':
            return (<div className="container" id='special'>
                <img className='centerImage' alt='alternative' src={props.content} />
            </div>)
        case 'text':
            return (<div className="container" id='special'>
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