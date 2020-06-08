import React, { useState, useEffect, useRef } from 'react';
import '../components/views/Home.css';

export default function Subject(props) {
    const [content, setContent] = useState('');
    const [type, setType] = useState('');
    const audio = useRef(null);
    useEffect(() => {
        setContent(props.content);
    }, [props.content]);
    useEffect(() => {
        setType(props.type);
    }, [props.type]);
    useEffect(() => {
        if (type === 'audio' && content) {
            audio.current.play();
        }
    }, [content]);
    useEffect(() => {
        if (type === 'audio' && content) {
            audio.current.play();
        }
    }, [type]);
    switch (type) {
        case 'audio':
            return (
                <div className="container" id='special'>
                    <audio controls className="container embed-responsive-item" ref={audio}>
                        <source src={content} type="audio/mpeg" />
                        Your browser does not support the audio element.
                    </audio>
                </div>
            )
        case 'img':
            return (<div className="container" id='special'>
                <img className='centerImage' src={content} />
            </div>)
        case 'text':
            return (<div className="container" id='special'>
                {content}
            </div>)
        case 'none':
            return (<div></div>)
        default:
            return (
                <div className="container">subject type not recognized</div>
            )
    }
}