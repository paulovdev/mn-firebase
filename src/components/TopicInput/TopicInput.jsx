import React, { useState } from "react";
import Autosuggest from "react-autosuggest";
import './TopicInput.scss'
const TopicInput = ({ topics, onSelectTopic }) => {
    const [value, setValue] = useState("");
    const [suggestions, setSuggestions] = useState([]);


    const onChange = (event, { newValue }) => {
        setValue(newValue);
        const selectedTopic = suggestions.find(topic => topic === newValue);
        if (selectedTopic) {
            onSelectTopic(selectedTopic);
        }
    };

    const onSuggestionsFetchRequested = ({ value }) => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;
        const filteredTopics = inputLength === 0 ? [] : topics.filter(
            topic => topic.toLowerCase().slice(0, inputLength) === inputValue
        );
        setSuggestions(filteredTopics);
    };

    const onSuggestionsClearRequested = () => {
        setSuggestions([]);
    };

    const inputProps = {
        placeholder: "Digite o tópico...",
        value,
        onChange: onChange
    };

    return (
        <div id="autosuggest">
            <Autosuggest
                suggestions={suggestions}
                onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                onSuggestionsClearRequested={onSuggestionsClearRequested}
                getSuggestionValue={suggestion => suggestion}
                renderSuggestion={suggestion => <div>{suggestion}</div>}
                inputProps={inputProps}
            /></div>
    );
};

export default TopicInput;
