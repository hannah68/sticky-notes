import "./style/style.css";
import { useState, useReducer } from "react";
import { v4 as uuid } from "uuid";

const initialNotesState = {
	lastNoteCreated: null,
	totalNotes: 0,
	notes: [],
};

// note reducer================================
const notesReducer = (prevState, action) => {
	switch (action.type) {
		case "ADD_NOTE": {
			const newState = {
				lastNoteCreated: new Date().toTimeString().slice(0, 8),
				totalNotes: prevState.notes.length + 1,
				notes: [...prevState.notes, action.payload],
			};
			return newState;
		}
		case "DELETE_NOTE": {
			const newState = {
				...prevState,
				totalNotes: prevState.notes.length - 1,
				notes: prevState.notes.filter((note) => note.id !== action.payload.id),
			};
			return newState;
		}
		default:
			return prevState;
	}
};

function App() {
	const [noteInput, setNoteInput] = useState("");
	const [noteState, dispatchNote] = useReducer(notesReducer, initialNotesState);

	// add note handler============================
	const addNotesHandler = (e) => {
		e.preventDefault();

		if (!noteInput) return;

		const newNote = {
			id: uuid(),
			text: noteInput,
			rotate: Math.floor(Math.random() * 20),
		};

		dispatchNote({ type: "ADD_NOTE", payload: newNote });
		setNoteInput("");
	};

	// drop note======================
	const dropNote = (e) => {
		e.target.style.left = `${e.pageX - 50}px`;
		e.target.style.top = `${e.pageY - 50}px`;
	};

	// drag over======================
	const dragOver = (e) => {
		e.stopPropagation();
		e.preventDefault();
	};

	return (
		<div className="app" onDragOver={dragOver}>
			<h1>Sticky Notes ({noteState.totalNotes})</h1>
			<span className="date">
				{noteState.totalNotes > 0
					? `Last note created: ${noteState.lastNoteCreated}`
					: ""}
			</span>
			<form className="note-form" onSubmit={addNotesHandler}>
				<textarea
					placeholder="Create a new note ..."
					onChange={(e) => setNoteInput(e.target.value)}
					value={noteInput}
				></textarea>
				<button className="btn">Add</button>
			</form>

			{noteState.notes.map((note) => {
				return (
					<div
						className="note"
						key={note.id}
						style={{ transform: `rotate(${note.rotate})` }}
						draggable="true"
						onDragEnd={dropNote}
					>
						<div
							className="close"
							onClick={() =>
								dispatchNote({
									type: "DELETE_NOTE",
									payload: note,
								})
							}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								strokeWidth="2"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</div>
						<pre className="text">{note.text}</pre>
					</div>
				);
			})}
		</div>
	);
}

export default App;
