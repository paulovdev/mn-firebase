import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import topicsData from '../../../data/TopicsData';
import { IoIosArrowRoundBack, IoIosSearch } from "react-icons/io";
import { Transition } from '../../../utils/Transition/Transition';
import './AllTopics.scss'

const AllTopics = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredTopics = topicsData.categories.map(category => ({
        ...category,
        topics: category.topics.filter(topic =>
            topic.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })).filter(category => category.topics.length > 0);

    return (
        <section id='all-topics'>
            <div className="container">
                <Link to="/" className="back">
                    <IoIosArrowRoundBack size={32} />
                    <p>Voltar</p>
                </Link>

                <h1>Topicos</h1>

                <div className="search-input">
                    <button type="submit">
                        <IoIosSearch size={20} />
                    </button>
                    <input
                        type="text"
                        placeholder="Pesquisar tópicos..."
                        value={searchQuery}
                        onChange={handleSearch}
                        className="search-input"
                    />
                </div>
                <br />
                <ul className='topic-container'>
                    {filteredTopics.map((category, index) => (
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
        </section>
    );
};

export default Transition(AllTopics);
