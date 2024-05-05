
import React from 'react';
import { Link } from 'react-router-dom';
import topicsData from '../../components/TopicInput/TopicsData';

import './TopicSelection.scss'

const TopicSelection = () => {
    return (
        <div id='topic-selection'>

            <div className="topics-text">
                <h1>Topicos</h1>
            </div>

            <ul className='topic-container'>
                {topicsData.categories.map((category, index) => (
                    <div key={index} className='topic'>
                        <h1>{category.name}</h1>
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
