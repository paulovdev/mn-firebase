
import React from 'react';
import { Link } from 'react-router-dom';
import topicsData from '../TopicInput/TopicsData';

import './TopicSelection.scss'

const TopicSelection = () => {
    return (
        <div id='topic-selection'>

            <div className="topic-head">
                <span>TOPICOS.</span>
                <div className="border-trending"></div>
            </div>

            <ul className='topic-container'>
                {topicsData.categories.map((category, index) => (
                    <div key={index} className='topic'>
                        <h3>{category.name}</h3>
                        <ul>
                            {category.topics.map((topic, idx) => (
                                <li key={idx}>
                                    <Link to={`/topic/${topic}`}>{topic}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </ul>
        </div>
    );
};

export default TopicSelection;
