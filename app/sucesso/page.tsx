import { Suspense } from "react";
import Conteudo from "./conteudo";
import Topo from "../components/Topo";

export default function Sucesso() {
  return (
    <>
      <Topo />
      <Suspense>
        <Conteudo />
      </Suspense>
    </>
  );
}
