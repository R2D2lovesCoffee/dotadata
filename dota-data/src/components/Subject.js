import React, { useState, useEffect } from 'react';

export default function Subject(props) {
    const [content, setContent] = useState('');
    const [type, setType] = useState('');
    const ref = document.getElementById('audio');
    useEffect(() => {
        setType(props.type);
    }, [props.type]);
    useEffect(() => {
        setContent(props.content);
        // if (content) {
        if (props.type === 'audio') {
            ref.pause();
            ref.load();
            ref.play();
        }
        // }
    }, [props.content]);
    switch (type) {
        case 'audio':
            return (
                <div>
                    <audio controls id="audio">
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