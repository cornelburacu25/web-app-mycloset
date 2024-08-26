import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Home from './pages/Home.jsx'
import MyClothes from './pages/MyClothes.jsx';
import MyOutfits from './pages/MyOutfits.jsx';
import OutfitPicker from './pages/OutfitPicker.jsx';
import UploadAndDisplayImage from './pages/test/UploadAndDisplayImage.jsx';
import Test from './pages/test/Test.jsx';
import AddClothing from './pages/test/AddClothing.jsx';
import NewClothing from './pages/NewClothing.jsx';
import EditClothing from './pages/EditClothing.jsx';
import Login from './pages/Login.jsx';
import RequireAuth from './components/RequireAuth.jsx';
import Register from './pages/Register.jsx';
import NewOutfit from './pages/NewOutfit.jsx';
import EditOutfit from './pages/EditOutfit.jsx';
import EditProfile from './pages/EditProfile.jsx';
import OutfitGenerator from './pages/OutfitGenerator.jsx';
import PickCreatedOutfit from './pages/PickCreatedOutfit.jsx';
import PickDislikedOutfit from './pages/PickDislikedOutfit.jsx';
import BuildOutfit from './pages/BuildOutfit.jsx';
import MyAccount from './pages/MyAccount.jsx';
import ChangePassword from './pages/ChangePassword.jsx';
import Statistics from './pages/Statistics.jsx';
import AccountActivation from './pages/AccountActivation.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <RequireAuth />, // RequireAuth nested within App
        children: [
          {
            path: '',
            element: <Home />
          },
          {
            path: 'myclothes',
            element: <MyClothes />,
          },
          {
            path: 'edit-clothing/:id',
            element: <EditClothing />
          },
          {
            path: 'myclothes/new',
            element: <NewClothing />
          },
          {
            path: 'myoutfits',
            element: <MyOutfits />
          },
          {
            path: 'edit-outfit/:id',
            element: <EditOutfit />
          },
          {
            path: 'myoutfits/new',
            element: < NewOutfit />
          },
          {
            path: 'outfitpicker',
            element: <OutfitPicker />
          },
          {
            path: 'outfitgenerator',
            element: <OutfitGenerator />,
          },
          {
            path: 'pick-a-created-outfit',
            element: <PickCreatedOutfit />,
          },
          {
            path: 'pick-a-disliked-outfit',
            element: <PickDislikedOutfit />,
          },
          {
            path: 'build-it-yourself',
            element: <BuildOutfit />,
          },
          {
            path: 'myaccount',
            element: <MyAccount/>,
            children: [
              {
                index: true,
                element: <Navigate to="edit-profile" replace />,
              },
              {
                path: 'edit-profile',
                element: <EditProfile />,
              },
              {
                path: 'change-password',
                element: <ChangePassword />,
              },
              {
                path: 'statistics',
                element: <Statistics />
              },
            ]
          },
          {
            path: 'test',
            element: <Test />,
            children: [
              {
                path: 'upload',
                element: <UploadAndDisplayImage />,
              },
              {
                path: 'add-clothing',
                element: <AddClothing />,
              },
            ],
          },
        ],
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      },
      {
        path: 'account-activation',
        element: <AccountActivation />,
      },
      {
        path: 'forgot-password',
        element: <ForgotPassword />,
      },
      {
        path: 'change-password',
        element: <ResetPassword />,
      }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
      <RouterProvider router={router}/>
  </React.StrictMode>
);