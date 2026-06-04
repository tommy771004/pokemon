/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import MapPage from "./pages/Map";
import Pokedex from "./pages/Pokedex";
import Characters from "./pages/Characters";
import Guide from "./pages/Guide";
import Buildings from "./pages/Buildings";

function AnimatedRoutes() {
  const location = useLocation();
  
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname, location.search]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-full"
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/pokedex" element={<Pokedex />} />
          <Route path="/characters" element={<Characters />} />
          <Route path="/guide" element={<Guide />} />
          <Route path="/buildings" element={<Buildings />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <Layout>
      <AnimatedRoutes />
    </Layout>
  );
}
