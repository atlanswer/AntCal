import { Title } from "@solidjs/meta";
import { useParams } from "@solidjs/router";
import { HttpStatusCode } from "@solidjs/start";

export default function NotFound() {
  const params = useParams<{ 404: string }>();

  return (
    <main>
      <Title>Not Found</Title>
      <HttpStatusCode code={404} />
      <h1>Page Not Found</h1>
      <code>{params[404]}</code>
    </main>
  );
}
