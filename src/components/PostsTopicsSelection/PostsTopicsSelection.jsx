import React from 'react';
import { Link } from 'react-router-dom';
import topicsData from '../TopicInput/TopicsData';
import './PostsTopicsSelection.scss';
import { color } from 'framer-motion';

const getRandomCategories = (categories, num = 4) => {
    const shuffled = [...categories].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
};

const PostsTopicsSelection = () => {
    const randomCategories = getRandomCategories(topicsData.categories);

    return (
        <div id='post-topic-selection'>
            <ul className='post-topic-container'>
                {randomCategories.map((category, index) => (
                    <Link to={`/topic/${category.name}`} key={index} className='post-topic'>
                        <h1>{category.name}</h1>
                        <div className="icon-background">
                            {React.createElement(category.icon) }
                        </div>
                    </Link>
                ))}
            </ul>
        </div>
    );
};

export default PostsTopicsSelection;
