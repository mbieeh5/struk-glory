"use client";
import React from "react";
import styled from "styled-components";

export default function Home() {
  return (
    <Main>
      <Center>
          hmmm
      </Center>
    </Main>
  );
}


const Main = styled.main`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Center = styled.div`
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;