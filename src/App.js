import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
	const [jsonInput, setJsonInput] = useState("");
	const [responseData, setResponseData] = useState(null);
	const [error, setError] = useState("");
	const [selectedOptions, setSelectedOptions] = useState([]);

	//Change this
	const apiUrl = "http://localhost:3000/bfhl";

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const parsedJson = JSON.parse(jsonInput);
			const response = await axios.post(apiUrl, parsedJson);
			setResponseData(response.data);
			setError("");
		} catch (err) {
			console.error("Error details:", err);
			setError("Invalid JSON format or API error");
			setResponseData("");
		}
	};

	const handleOptionChange = (event) => {
		const { value, checked } = event.target;
		if (checked) {
			setSelectedOptions([...selectedOptions, value]);
		} else {
			setSelectedOptions(selectedOptions.filter((option) => option !== value));
		}
	};

	const renderFilteredResponse = () => {
		if (!responseData) return null;

		let filteredData = {};
		if (selectedOptions.includes("Alphabets"))
			filteredData.alphabets = responseData.alphabets;
		if (selectedOptions.includes("Numbers"))
			filteredData.numbers = responseData.numbers;
		if (selectedOptions.includes("Highest Lowercase Alphabet")) {
			filteredData.highest_lowercase_alphabet =
				responseData.highest_lowercase_alphabet;
		}

		return <pre>{JSON.stringify(filteredData, null, 2)}</pre>;
	};

	return (
		<div className="App">
			<h1>BFHL Frontend</h1>

			<form onSubmit={handleSubmit}>
				<label htmlFor="json-input">Enter JSON:</label>
				<textarea
					id="json-input"
					rows="5"
					value={jsonInput}
					onChange={(e) => setJsonInput(e.target.value)}
					placeholder='Enter JSON e.g. {"data": ["M","1","334","4","B","Z","a"]}'
				/>
				<button type="submit">Submit</button>
			</form>

			{error && <p className="error">{error}</p>}

			{responseData && (
				<>
					<h3>Select Data to Display:</h3>
					<div className="multi-select">
						<label>
							<input
								type="checkbox"
								value="Alphabets"
								onChange={handleOptionChange}
							/>{" "}
							Alphabets
						</label>
						<label>
							<input
								type="checkbox"
								value="Numbers"
								onChange={handleOptionChange}
							/>{" "}
							Numbers
						</label>
						<label>
							<input
								type="checkbox"
								value="Highest Lowercase Alphabet"
								onChange={handleOptionChange}
							/>{" "}
							Highest Lowercase Alphabet
						</label>
					</div>

					<div className="response-data">
						<h4>Filtered Response:</h4>
						{renderFilteredResponse()}
					</div>
				</>
			)}

			{responseData && (
				<div className="response-data">
					<h4>Full Response:</h4>
					<pre>{JSON.stringify(responseData, null, 2)}</pre>
				</div>
			)}
		</div>
	);
}

export default App;
