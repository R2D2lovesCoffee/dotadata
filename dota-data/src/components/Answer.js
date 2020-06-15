import React, { useState, useEffect } from 'react';

export default function Answer(props) {
    const [content, setContent] = useState('');
    const [type, setType] = useState('');
    const ref = document.getElementById('audio');

    useEffect(() => {
        setType(props.type);
    }, [props.type]);
    useEffect(() => {
        setContent(props.content);

    }, [props.content]);

    switch (type) {
        case 'audio':
            return (
                <div>
                    <audio controls>
                        <source src={content} type="audio/mpeg" />
                        Your browser does not support the audio element.
                    </audio>
                </div>
            )
        case 'img':
            return (<div className="clickable container" id='answerDesign' onClick={props.onAnswerClick.bind(this, props.index)}>
                <li><img className='smallerImg' alt='alternative' src={content} /></li>
            </div>)
        case 'text':
            return (<div className="clickable container" id='answerDesign' onClick={props.onAnswerClick.bind(this, props.index)} >
                <li>{content}</li>
            </div>)
        default:
            return (
                <div className="container">subject type not recognized</div>
            )
    }
}