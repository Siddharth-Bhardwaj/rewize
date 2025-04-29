import React from "react";

import Profile from "@/components/Profile";
import PageContainer from "@/components/PageContainer";

const ProfilePage = () => {
  return (
    <PageContainer>
      {/* <h1 className="mb-6 text-4xl font-bold text-white">Update Profile</h1> */}

      <Profile />
    </PageContainer>
  );
};

export default ProfilePage;
