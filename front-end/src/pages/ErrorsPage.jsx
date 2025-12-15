import {useState} from 'react';
import './ErrorsPage.css';



export const ErrorsPage = (props) => {

    const fromPath = props.fromPath || '/';
    const errorCode = `${props.errorCode.match(/\d\d\d/)}` ? props.errorCode : '000';
    const errorMessage = props.errorMessage || 'An unexpected error has occurred.';

    return (
        <div className="errors-page-bg">
            <div className="errors-page-card">
                <div className="errors-page-icon">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <circle cx="24" cy="24" r="22" fill="#fff" stroke="#e53935" strokeWidth="3"/>
                    <rect x="22" y="13" width="4" height="16" rx="2" fill="#e53935"/>
                    <rect x="22" y="33" width="4" height="4" rx="2" fill="#e53935"/>
                  </svg>
                </div>
                <h1 className="errors-page-title">{props.title || 'Error'}</h1>
                <p className="errors-page-message">{errorMessage}</p>
                <p className="errors-page-code"><span>{errorCode}</span></p>
            </div>
        </div>
    );
}