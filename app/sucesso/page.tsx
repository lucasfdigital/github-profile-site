import { Suspense } from "react";
import Conteudo from "./conteudo";

export default function Sucesso() {
  return (
    <Suspense>
      <Conteudo />
    </Suspense>
  );
}
