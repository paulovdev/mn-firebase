import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import topicsData from '../../../data/TopicsData';
import { IoIosArrowRoundBack, IoIosSearch } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";

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
        <AnimatePresence mode='wait'>
            <section id='all-topics'>
                <Link to="/" className="back">
                    <IoIosArrowRoundBack size={32} />
                    <p>Inicio</p>
                </Link>
                <h1>Topicos</h1>
                <div className="border-bottom"></div>

                <motion.div className="search-input"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}>
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
                </motion.div>
                <br />
                <motion.ul className='topic-container'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}>
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
                </motion.ul>

            </section>
        </AnimatePresence>
    );
};

export default AllTopics;
