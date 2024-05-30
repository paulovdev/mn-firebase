import React from 'react';
import { Link } from 'react-router-dom';
import topicsData from '../../../data/TopicsData';
import { IoIosArrowRoundBack } from "react-icons/io";
import { Transition } from '../../../utils/Transition/Transition';
import './AllTopics.scss'

const AllTopics = () => {
    return (
        <div id='all-topics'>
            <div className="container">
                <Link to="/" className="back">
                    <IoIosArrowRoundBack size={32} />
                    <p>Voltar</p>
                </Link>

                <h1>
                    Topicos
                </h1>

                <ul className='topic-container'>
                    {topicsData.categories.map((category, index) => (
                        <div key={index} className='topic'>
                            <h2>{category.name}</h2>
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
        </div>
    );
};

export default Transition(AllTopics);
