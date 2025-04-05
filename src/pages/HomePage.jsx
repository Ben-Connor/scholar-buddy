import SearchPage from "../components/SearchPage";

export default function HomePage() {
  return (
    <div className="home-page">
      <h1>Scholar Buddy</h1>
      <p>Search academic papers and get AI-powered summaries</p>
      <SearchPage />
    </div>
  );
}
