import React, { useState } from "react";

export default function ProjectFilters({ onChange, initial = {} }) {
  const [q, setQ] = useState(initial.q || "");
  const [skills, setSkills] = useState(initial.skills || "");
  const [min, setMin] = useState(initial.min || "");
  const [max, setMax] = useState(initial.max || "");
  const [status, setStatus] = useState(initial.status || "");

  function submit(e) {
    e.preventDefault();
    onChange({ q, skills, min, max, status });
  }

  return (
    <form className="form" onSubmit={submit} style={{ marginBottom: "1rem" }}>
      <input
        className="input"
        placeholder="Search..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <input
        className="input"
        placeholder="Skills (comma)"
        value={skills}
        onChange={(e) => setSkills(e.target.value)}
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: ".6rem",
        }}
      >
        <input
          className="input"
          type="number"
          placeholder="Min €"
          value={min}
          onChange={(e) => setMin(e.target.value)}
        />
        <input
          className="input"
          type="number"
          placeholder="Max €"
          value={max}
          onChange={(e) => setMax(e.target.value)}
        />
      </div>
      <select
        className="input"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="">Any status</option>
        <option value="open">Open</option>
        <option value="in_progress">In progress</option>
        <option value="completed">Completed</option>
      </select>
      <button className="btn" type="submit">
        Filter
      </button>
    </form>
  );
}
