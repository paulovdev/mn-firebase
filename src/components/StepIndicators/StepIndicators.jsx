import React from 'react';
import { MdOutlineTitle, MdTopic } from 'react-icons/md';
import { FaRegImage } from 'react-icons/fa';
import { IoMdColorPalette } from 'react-icons/io';
import { BsTextRight } from 'react-icons/bs';
import './StepIndicators.scss'

const steps = [
    { id: 1, icon: <MdOutlineTitle size={26} />, text: 'Título' },
    { id: 2, icon: <MdTopic size={26} />, text: 'Tópico' },
    { id: 3, icon: <FaRegImage size={26} />, text: 'Imagem' },
    { id: 4, icon: <IoMdColorPalette size={26} />, text: 'Cor' },
    { id: 5, icon: <BsTextRight size={26} />, text: 'Conteúdo' },
];

const StepIndicators = ({ currentStep }) => {
    return (
        <div className="step-indicators" >
            {steps.map((step) => (
                <div key={step.id} className={`indicator ${currentStep === step.id ? 'active' : ''}`}>
                    <div className="step-icon">{step.icon}</div>
                    {currentStep === step.id && (
                        <div className="step-content-text">
                            <span>Etapa {step.id}/5</span>
                            <p>{step.text}</p>
                        </div>
                    )}
                    <div className="border-left-step"></div>
                </div>
            ))}
        </div>
    );
};

export default StepIndicators;
