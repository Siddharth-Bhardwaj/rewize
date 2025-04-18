import React from "react";

import Container from "./Container";
import Select from "./ui/select";

const CardDetailsContainer = () => {
  return (
    <Container>
      <Select
        options={[
          { value: "Chase", label: "Chase" },
          { value: "Chase", label: "Chase" },
          { value: "Chase", label: "Chase" },
          { value: "Chase", label: "Chase" },
          { value: "Chase", label: "Chase" },
          { value: "Chase", label: "Chase" },
          { value: "Chase", label: "Chase" },
          { value: "Chase", label: "Chase" },
        ]}
      />
    </Container>
  );
};

export default CardDetailsContainer;
