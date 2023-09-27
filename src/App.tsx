import { useState, useEffect } from "react";
import { requestUsers, User } from "./api";
import "./styles.css";

export default function App() {
  const [state, setState] = useState({
    name: "",
    age: "",
    page: 0,
    limit: 4,
  });

  type TData = User[] | undefined;
  type TError = { message: string; stack: string } | undefined;

  const [data, setData] = useState<TData>();
  const [error, setError] = useState<TError>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await requestUsers({
          name: state.name,
          age: state.age,
          limit: state.limit,
          offset: state.page * state.limit,
        });
        setData(result);
        setError(undefined);
      } catch (error: any) {
        setError(error.message);
      }
    };

    fetchData();
  }, [state]);

  return (
    <section style={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
      <form style={{ display: "flex", gap: ".5rem" }}>
        <input
          type="text"
          value={state.name}
          onChange={(e) => setState({ ...state, name: e.target.value })}
          placeholder="Name"
        />
        <input
          type="text"
          value={state.age}
          onChange={(e) => setState({ ...state, age: e.target.value })}
          placeholder="Age"
        />
      </form>
      <ul>
        {!data && error ? (
          <div>
            <p>{error.message}</p>
          </div>
        ) : !data ? (
          <div>
            <p>Loading...</p>
          </div>
        ) : data.length === 0 ? (
          <div>
            <p>Users not found</p>
          </div>
        ) : (
          data.map((e: User, i: number) => (
            <li key={i + e.id}>
              <p>
                {e.name}, {e.age}
              </p>
            </li>
          ))
        )}
      </ul>
      <div style={{ display: "flex", gap: ".5rem" }}>
        <p>By page: </p>
        <select
          value={state.limit}
          onChange={(e) =>
            setState({ ...state, page: 0, limit: +e.target.value })
          }
          style={{ width: "min-content", height: "min-content" }}
        >
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
        </select>
        <button
          onClick={() =>
            setState((prev) => ({
              ...prev,
              page: prev.page !== 0 ? prev.page - 1 : 0,
            }))
          }
        >
          Prev
        </button>
        <p>Page: {state.page}</p>
        <button
          onClick={() => setState((prev) => ({ ...prev, page: prev.page + 1 }))}
        >
          Next
        </button>
      </div>
    </section>
  );
}
