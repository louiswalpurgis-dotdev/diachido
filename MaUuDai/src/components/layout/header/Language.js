import React, { useContext, useEffect, useRef, useState } from 'react';
import { AppContext } from '~/Context/AppProvider';
import { IconSvg, languages } from '~/components/constant';

const LanguageOption = ({ lang, language, handleOptionSelect }) => {
    return (
        <div
            className={`group px-4 py-2 cursor-pointer hover:bg-gray-100 hover:text-gray-900 font-normal ${
                lang.code === language ? 'bg-gray-100' : ''
            }`}
            onClick={() => handleOptionSelect(lang)}
        >
            <div className="flexStart gap-2">
                <img src={lang.icon} alt="language" className="w-6" />
                <span className="text-sm text-gray-500 group-hover:text-gray-700">{lang.name}</span>
            </div>
        </div>
    );
};

const Language = () => {
    const languageRef = useRef();
    const [isOpen, setIsOpen] = useState(false);
    const { language, setLanguage } = useContext(AppContext);

    const toggleDropdown = (e) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
    };

    const handleOptionSelect = (lang) => {
        setLanguage(lang.code);
        setIsOpen(false);
    };

    useEffect(() => {
        // Define a function to close the menu
        let closeMenu = (e) => {
            if (!languageRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };

        // Listen for click events on the document
        document.addEventListener('mousedown', closeMenu);

        // Cleanup: Remove the event listener when the component is unmounted
        return () => {
            document.removeEventListener('mousedown', closeMenu);
        };
    }, []);

    return (
        <div className="relative" ref={languageRef}>
            <button
                className={`flexCenter gap-2 text-slate-500 hover:text-slate-600 radiusFull animation200 p-1.5 px-2.5 ${
                    isOpen ? 'bg-gray-200/30 focus-within:bg-white/70' : 'bg-gray-200/30'
                }`}
                onClick={toggleDropdown}
                aria-haspopup="true"
                aria-expanded={isOpen}
            >
                <img src={IconSvg.language} alt="language" className="w-5 h-5" />
                <span className="text-sm font-semibold">{language}</span>
            </button>
            {isOpen && (
                <div
                    className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
                    role="menu"
                    aria-orientation="vertical"
                >
                    <div className="py-1" role="none">
                        {languages.map((lang) => (
                            <LanguageOption
                                key={lang.code}
                                lang={lang}
                                language={language}
                                handleOptionSelect={handleOptionSelect}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Language;
