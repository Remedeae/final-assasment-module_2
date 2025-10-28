import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

type Game = { id: string; name: string };

async function getGames(): Promise<Game[]> {
  const res = await fetch("/api/games");
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to load games");
  }
  return res.json();
}

async function addGame(name: string): Promise<void> {
  const res = await fetch("/api/games", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to add game");
  }
}

export default function ChooseGamePage() {
  const [games, setGames] = useState<Game[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const userId = params.get("userId"); // e.g. /choose?userId=3

  useEffect(() => {
    (async () => {
      try {
        setGames(await getGames());
      } catch (e: unknown) {
        if (e instanceof Error) {
          setError(e.message || "Failed to load games");
        } else {
          setError("Failed to load games");
        }
      }
    })();
  }, []);

  async function handleCreate(name: string) {
    try {
      await addGame(name);
      setGames(await getGames());
      setError(null);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message || "Failed to add game");
      } else {
        setError("Failed to add game");
      }
    }
  }

  function choose(game: Game) {
    if (!userId) {
      alert(`Select a user first. (Selected game: ${game.name})`);
      return;
    }
    navigate(`/play/${userId}/${game.id}`);
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Choose a game to play</h2>
      {error && <div className="text-red-600 text-sm">{error}</div>}

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {games.map((g) => (
          <li key={g.id} className="card flex items-center justify-between">
            <span className="font-medium">{g.name}</span>
            <button className="btn" onClick={() => choose(g)}>Choose</button>
          </li>
        ))}
      </ul>

      <AddGame onCreate={handleCreate} />
    </div>
  );
}

function AddGame({ onCreate }: { onCreate: (name: string) => Promise<void> }) {
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  return (
    <form
      className="card grid gap-2 max-w-md"
      onSubmit={async (e) => {
        e.preventDefault();
        if (!name.trim()) return;
        setBusy(true);
        await onCreate(name.trim());
        setName("");
        setBusy(false);
      }}
    >
      <h3 className="font-semibold">Add Game</h3>
      <input
        className="input"
        placeholder="Game name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <button className="btn w-fit" type="submit" disabled={busy}>
        {busy ? "Adding…" : "Create"}
      </button>
    </form>
  );
}
