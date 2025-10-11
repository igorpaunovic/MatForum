import { Link } from "@tanstack/react-router";

export function DefaultErrorComponent({ error }: { error: Error }) {

  return (
    <div className="flex size-full flex-col items-center justify-center gap-2">
      <div className="relative flex flex-col items-center justify-center gap-4 text-center">
        <img
          src="./error-component-logo.png"
          alt={error.name}  // don't have error componenet logo i will add it 
          className="absolute opacity-30"
        />
        <p className="z-10 text-xl font-bold">{"Error"}</p>
        <p className="z-10 text-sm font-bold text-muted-foreground">
            {error.message}
        </p>
        <button type="button" className="z-10" onClick={() => window.location.reload()}>
          {"Reset"}
        </button>
        <button type="button" className="z-10">
          <Link to="/">{"Go home"}</Link>
        </button>
      </div>
    </div>
  );
}