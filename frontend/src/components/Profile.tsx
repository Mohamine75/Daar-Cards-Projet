import React from 'react';
import { Wallet } from '@/lib/ethereum'; // Assuming you have this type defined

interface ProfileProps {
  wallet: Wallet;
}

const Profile: React.FC<ProfileProps> = ({ wallet }) => {
  return (
    <div>
      <h1>Your Profile</h1>
      <p>Address: {wallet.details.address}</p>
      {/* Afficher plus d'infos sur le wallet ou l'utilisateur */}
    </div>
  );
};

export default Profile;
