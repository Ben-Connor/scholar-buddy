import { motion } from "framer-motion";
import SearchPage from "../components/SearchPage";
import HomeButton from '../components/HomeButton';

export default function HomePage() {
  return (
    <motion.div
      className="home-page"
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.5 }}
    >
      <HomeButton />
      <h1>Scholar Buddy</h1>
      <p>Search academic papers and get AI-powered summaries</p>
      <SearchPage />
    </motion.div>
  );
}