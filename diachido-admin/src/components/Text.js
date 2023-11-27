import { Link } from 'react-router-dom';

const Text = ({ text, href, fontSize, fontWeight, colorFrom, colorVia, colorTo, color }) => {
    const gradientStyles = {
        background: `linear-gradient(45deg, ${colorFrom}, ${colorVia}, ${colorTo})`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontSize: fontSize,
        fontWeight: fontWeight,
    };

    if (!colorFrom || !colorTo) {
        gradientStyles.background = 'none';
        gradientStyles.WebkitBackgroundClip = 'none';
        gradientStyles.WebkitTextFillColor = color;
    }

    return (
        <Link to={href}>
            <h3
                className={`truncate ${fontSize ? fontSize : 'text-md'} ${fontWeight ? fontWeight : 'font-normal'}`}
                style={gradientStyles}
            >
                {text}
            </h3>
        </Link>
    );
};

export default Text;
