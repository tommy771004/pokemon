/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import MapPage from "./pages/Map";
import Pokedex from "./pages/Pokedex";
import Characters from "./pages/Characters";
import Guide from "./pages/Guide";

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/map" element={<PageWrapper><MapPage /></PageWrapper>} />
        <Route path="/pokedex" element={<PageWrapper><Pokedex /></PageWrapper>} />
        <Route path="/characters" element={<PageWrapper><Characters /></PageWrapper>} />
        <Route path="/guide" element={<PageWrapper><Guide /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
}

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  return (
    <Layout>
      <AnimatedRoutes />
    </Layout>
  );
}
