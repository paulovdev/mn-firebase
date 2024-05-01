import React, { useState } from "react";
import Autosuggest from "react-autosuggest";
import './TopicInput.scss'
const TopicInput = ({ topics, onSelectTopic }) => {
    const [value, setValue] = useState("");
    const [suggestions, setSuggestions] = useState([]);

    // Função para lidar com a mudança de valor no campo de entrada
    const onChange = (event, { newValue }) => {
        setValue(newValue);
        // Chama a função para atualizar o tópico selecionado no componente pai
        onSelectTopic(newValue);
    };

    // Função para definir as sugestões de acordo com o valor digitado
    const onSuggestionsFetchRequested = ({ value }) => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;
        const filteredTopics = inputLength === 0 ? [] : topics.filter(
            topic => topic.toLowerCase().slice(0, inputLength) === inputValue
        );
        setSuggestions(filteredTopics);
    };

    // Função para limpar as sugestões
    const onSuggestionsClearRequested = () => {
        setSuggestions([]);
    };

    // Opções para o campo de entrada
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
