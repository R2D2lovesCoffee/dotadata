import React, { useState, useEffect, useRef } from 'react';

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
            audio.current.pause();
            audio.current.load();
            audio.current.play();
        }
    }, [content]);
    useEffect(() => {
        if (type === 'audio' && content) {
            audio.current.pause();
            audio.current.load();
            audio.current.play();
        }
    }, [type]);
    switch (type) {
        case 'audio':
            return (
                <div>
                    <audio controls ref={audio}>
                        <source src={content} type="audio/mpeg" />
                        Your browser does not support the audio element.
                    </audio>
                </div>
            )
        case 'img':
            return (<div>
                <img src={content} />
            </div>)
        case 'text':
            return (<div>
                {content}
            </div>)
        case 'none':
            return (<div></div>)
        default:
            return (
                <div>subject type not recognized</div>
            )
    }
}