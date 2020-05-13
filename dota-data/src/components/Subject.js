import React, { useState, useEffect, useRef } from 'react';

export default function Subject(props) {
    const [content, setContent] = useState('');
    const [type, setType] = useState('');
    const audio = useRef(null);
    useEffect(() => {
        if (props.content && props.type) {
            setContent(props.content);
            setType(props.type);
        }
    }, [props.content, props.type]);
    useEffect(() => {
        if (content) {
            if (type === 'audio') {
                audio.current.pause();
                audio.current.load();
                audio.current.play();
            }
        }
    }, [content])
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
                test
            </div>)
        default:
            return (
                <div>subject type not recognized</div>
            )
    }
}