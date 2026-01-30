
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './screens/Home';
import Scanner from './screens/Scanner';
import ItemDetail from './screens/ItemDetail';
import OutfitBuilder from './screens/OutfitBuilder';
import OutfitCatalog from './screens/OutfitCatalog';
import CategoryDetail from './screens/CategoryDetail';
import Inventory from './screens/Inventory';
import Login from './screens/Login';
import RequireAuth from './components/RequireAuth';
import Navigation from './components/Navigation';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen pb-24 max-w-md mx-auto relative bg-pop-grey-2 border-x-4 border-black shadow-2xl overflow-x-hidden">
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<RequireAuth />}>
            <Route path="/" element={<Home />} />
            <Route path="/scanner" element={<Scanner />} />
            <Route path="/category/:categoryName" element={<CategoryDetail />} />
            <Route path="/item-detail/:id" element={<ItemDetail />} />
            <Route path="/builder" element={<OutfitBuilder />} />
            <Route path="/catalog" element={<OutfitCatalog />} />
            <Route path="/inventory" element={<Inventory />} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <Navigation /> {/* Note: Navigation might need to be hidden on Login page, but keeping simple for now */}
      </div>
    </Router>
  );
};

export default App;
