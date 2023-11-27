import { Helmet } from 'react-helmet';

export default function Helmets({ image, description }) {
    return (
        <Helmet>
            <meta property="og:image" content={image} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={window.location.href} />
            <meta name="twitter:card" content={image} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />

        </Helmet>
    );
}
