import SearchPage from "../components/SearchPage";
import logo from '../assets/logo1.png';
import HomeButton from '../components/HomeButton';

export default function HomePage() {
  return (
    <div className="home-page">
      <HomeButton /> {/* Home Button */}
      <h1>Scholar Buddy</h1>
      <p>Search academic papers and get AI-powered summaries</p>
      <SearchPage />
    </div>
  );
}
