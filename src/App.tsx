/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import MapPage from "./pages/Map";
import Pokedex from "./pages/Pokedex";
import Guide from "./pages/Guide";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/pokedex" element={<Pokedex />} />
        <Route path="/guide" element={<Guide />} />
      </Routes>
    </Layout>
  );
}
