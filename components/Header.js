import Link from "next/link";

const linkStyle = {
    marginRight: 15
};

const Header = () => (
    <div>
        <Link href="/">
            <a style={linkStyle}>Awesome Home Page</a>
        </Link>
    </div>
);

export default Header;
