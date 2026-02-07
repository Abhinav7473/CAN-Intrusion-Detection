# app1.py

import pandas as pd
import numpy as np
import random
import streamlit as st
import mysql.connector
import time
from sklearn.svm import OneClassSVM
from sklearn.preprocessing import StandardScaler
import tensorflow as tf
from tensorflow.keras.models import Sequential, load_model # type: ignore
from tensorflow.keras.layers import LSTM, Dense, Dropout, RepeatVector, TimeDistributed # type: ignore
import matplotlib.pyplot as plt
import graphviz
from tensorflow.keras.losses import mse
from streamlit_lottie import st_lottie
import matplotlib.pyplot as plt
import requests
import pickle

# Load dataset (make sure the file is in the same directory or provide a full path)
df = pd.read_csv("CAN.csv")  # Change this to your actual dataset filename
def load_lottieurl(url):
    try:
        response = requests.get(url)
        response.raise_for_status()  # Ensure valid response
        return response.json()  # Convert to JSON
    except requests.exceptions.RequestException as e:
        st.warning(f"⚠️ Error loading animation: {e}")
        return None  # Return None if an error occurs

# Load Lottie Animation
valid_lottie_url = "https://assets10.lottiefiles.com/packages/lf20_jcikwtux.json"
login_animation = load_lottieurl(valid_lottie_url)
def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="$Sri123456",
        database="your_database"
    )

# Initialize session state
if 'page' not in st.session_state:
    st.session_state.page = 'login'  

# Custom CSS for Advanced Styling
st.markdown(
    """
    <style>
        /* Background Gradient Animation */
        @keyframes gradient {
            0% {background-position: 0% 50%;}
            50% {background-position: 100% 50%;}
            100% {background-position: 0% 50%;}
        }
        body {
            background: linear-gradient(-45deg, #0f2027, #203a43, #2c5364);
            background-size: 400% 400%;
            animation: gradient 10s ease infinite;
            color: white;
        }
        .title {
            text-align: center;
            font-size: 45px;
            font-weight: bold;
            color: #00ffcc;
        }
        .subtitle {
            text-align: center;
            font-size: 22px;
            color: #ffffff;
        }
        .login-box {
            width: 40%;
            margin: auto;
            padding: 30px;
            border-radius: 12px;
            background-color: rgba(0, 0, 0, 0.7);
            box-shadow: 0px 0px 15px rgba(0, 255, 204, 0.6);
        }
        .stTextInput > div > div > input {
            background-color: white;
            color: black;
        }
        .stButton button {
            background-color: #00ffcc;
            color: black;
            border-radius: 8px;
            font-weight: bold;
            transition: 0.3s;
        }
        .stButton button:hover {
            background-color: #00ddff;
            transform: scale(1.05);
        }
    </style>
    """,
    unsafe_allow_html=True
)

# Login Page UI
if st.session_state.page == 'login':
    st.markdown('<p class="title">🔒 SensorShield: AI-Powered Cybersecurity for EVs</p>', unsafe_allow_html=True)
    st.markdown('<p class="subtitle">Protecting Electric Vehicles with AI-Driven Anomaly Detection</p>', unsafe_allow_html=True)

    # Animated Login Section
    with st.container():
        col1, col2 = st.columns([1, 1])
        with col1:
            if login_animation:
                st_lottie(login_animation, height=200)
            else:
                st.image("https://www.tesla.com/sites/default/files/modelsx-new/social/model-s-hero-social.jpg", width=320)
        with col2:
            st.image("https://www.tesla.com/sites/default/files/modelsx-new/social/model-s-hero-social.jpg", width=320)

    st.markdown("---")

    # Centered Login Form
    with st.container():
        
        st.subheader("🔑 Secure Vehicle Login")

        vehicle_number = st.text_input("🚗 Enter Vehicle Number", key="vehicle_number")
        password = st.text_input("🔐 Enter Password", type="password", key="password")

        if st.button("Login"):
            if not vehicle_number or not password:
                st.error("⚠️ Please enter both Vehicle Number and Password.")
            else:
                try:
                    conn = get_db_connection()
                    cursor = conn.cursor()
                    cursor.execute("SELECT * FROM users WHERE vehicle_number = %s AND password = %s", (vehicle_number, password))
                    user = cursor.fetchone()
                    cursor.close()
                    conn.close()

                    if user:
                        st.success("✅ Login successful! Redirecting...")
                        time.sleep(1.5)
                        st.session_state.page = 'dashboard'  
                        st.rerun()  
                    else:
                        st.error("❌ Invalid credentials. Please try again.")

                except Exception as e:
                    st.error("⚠️ Server error! Please try again later.")
                    st.text(f"Error: {str(e)}")  

        st.markdown('</div>', unsafe_allow_html=True)

    # Key Metrics Section
    col1, col2, col3 = st.columns(3)

    with col1:
        st.metric(label="🚗 EVs on Road", value="10M+", delta="Rising 🚀")
    with col2:
        st.metric(label="⚠️ Cyber Threats", value="5K+", delta="Increasing 📈")
    with col3:
        st.metric(label="🔒 AI Security Success", value="99.9%", delta="Improved 💡")

    st.markdown("---")
    st.write("💡 **The Future of AI in EV Security:** SensorShield creates a **secure AI-powered ecosystem** enhancing resilience against cyber threats in electric vehicles.")

    # Footer
    st.markdown('<p style="text-align:center; color:lightgray;">&copy; 2025 SensorShield | AI-Powered EV Cybersecurity</p>', unsafe_allow_html=True)

elif st.session_state.page == 'dashboard':
# Attack generation functions
    def generate_attack(attack_type, num_samples=10):
        attack_data = []

        if attack_type == "fuzzy":
            for _ in range(num_samples):
                attack_data.append({
                    "tag": f"Fuzzy_{random.randint(1000, 9999)}",
                    "datetime": pd.Timestamp.now(),
                    "Accelerometer1RMS": random.uniform(0, 50),
                    "Accelerometer2RMS": random.uniform(0, 50),
                    "Current": random.uniform(0, 10),
                    "Pressure": random.uniform(10, 100),
                    "Temperature": random.uniform(20, 100),
                    "Thermocouple": random.uniform(10, 50),
                    "Voltage": random.uniform(200, 250),
                    "Volume Flow RateRMS": random.uniform(5, 50),
                    "Attack": "Fuzzy"
                })

        elif attack_type == "spoofing":
            sampled_rows = df.sample(n=num_samples)
            for _, row in sampled_rows.iterrows():
                attack_data.append({
                    "tag": row["tag"],
                    "datetime": pd.Timestamp.now(),
                    "Accelerometer1RMS": row["Accelerometer1RMS"] + random.uniform(-2, 2),
                    "Accelerometer2RMS": row["Accelerometer2RMS"] + random.uniform(-2, 2),
                    "Current": row["Current"] + random.uniform(-1, 1),
                    "Pressure": row["Pressure"] + random.uniform(-5, 5),
                    "Temperature": row["Temperature"] + random.uniform(-3, 3),
                    "Thermocouple": row["Thermocouple"] + random.uniform(-2, 2),
                    "Voltage": row["Voltage"] + random.uniform(-5, 5),
                    "Volume Flow RateRMS": row["Volume Flow RateRMS"] + random.uniform(-3, 3),
                    "Attack": "Spoofing"
                })

        elif attack_type == "replay":
            sampled_rows = df.sample(n=num_samples)
            for _, row in sampled_rows.iterrows():
                attack_data.append({
                    "tag": row["tag"],
                    "datetime": pd.Timestamp.now() + pd.Timedelta(seconds=random.randint(10, 300)),
                    "Accelerometer1RMS": row["Accelerometer1RMS"],
                    "Accelerometer2RMS": row["Accelerometer2RMS"],
                    "Current": row["Current"],
                    "Pressure": row["Pressure"],
                    "Temperature": row["Temperature"],
                    "Thermocouple": row["Thermocouple"],
                    "Voltage": row["Voltage"],
                    "Volume Flow RateRMS": row["Volume Flow RateRMS"],
                    "Attack": "Replay"
                })

        elif attack_type == "dos":
            sampled_rows = df.sample(n=num_samples)
            for _ in range(5):  # Simulating flooding
                for _, row in sampled_rows.iterrows():
                    attack_data.append({
                        "tag": row["tag"],
                        "datetime": pd.Timestamp.now(),
                        "Accelerometer1RMS": row["Accelerometer1RMS"],
                        "Accelerometer2RMS": row["Accelerometer2RMS"],
                        "Current": row["Current"],
                        "Pressure": row["Pressure"],
                        "Temperature": row["Temperature"],
                        "Thermocouple": row["Thermocouple"],
                        "Voltage": row["Voltage"],
                        "Volume Flow RateRMS": row["Volume Flow RateRMS"],
                        "Attack": "DoS"
                    })

        return attack_data

    features=[
            "datetime", "Accelerometer1RMS", "Accelerometer2RMS", "Current", "Pressure",
            "Temperature", "Thermocouple", "Volume Flow RateRMS","Voltage"]
    # Convert timestamp to numerical format (if not already)
    df["datetime"] = pd.to_datetime(df["datetime"]).astype(int) / 10**9  # Convert to seconds

    scaler = StandardScaler()
    X_train = df[features]
    X_train_scaled = scaler.fit_transform(X_train)

    oc_svm = OneClassSVM(kernel="rbf", gamma="auto", nu=0.05)
    oc_svm.fit(X_train_scaled)

    def detect_anomaly(sensor_values):
        sensor_values_scaled = scaler.transform([sensor_values])
        anomaly_score = oc_svm.decision_function(sensor_values_scaled)[0]
        prediction = 1 if anomaly_score >= 60 else -1
        return prediction, anomaly_score

    def train_lstm_model(df):
        df["datetime"] = pd.to_datetime(df["datetime"]).astype(int) / 10**9
        data = df[features].values
        scaler = StandardScaler()
        data_scaled = scaler.fit_transform(data)
        SEQ_LEN = 10
        X = []
        for i in range(len(data_scaled) - SEQ_LEN):
            X.append(data_scaled[i: i + SEQ_LEN])
        X = np.array(X)
        split = int(0.8 * len(X))
        X_train, X_test = X[:split], X[split:]
        model = Sequential([
            LSTM(64, activation="relu", input_shape=(SEQ_LEN, X.shape[2]), return_sequences=True),
            Dropout(0.2),
            LSTM(32, activation="relu", return_sequences=False),
            RepeatVector(SEQ_LEN),
            LSTM(32, activation="relu", return_sequences=True),
            Dropout(0.2),
            LSTM(64, activation="relu", return_sequences=True),
            TimeDistributed(Dense(X.shape[2]))
        ])
        model.compile(optimizer="adam", loss="mse")
        model.fit(X_train, X_train, epochs=2, batch_size=32, validation_data=(X_test, X_test), verbose=0)
        X_test_pred = model.predict(X_test, verbose=0)
        reconstruction_error = np.mean(np.abs(X_test_pred - X_test), axis=(1, 2))
        THRESHOLD = np.percentile(reconstruction_error, 95)
        return model, scaler, THRESHOLD

    def color_code_anomalies(df):
        colors = {}
        for feature in ["datetime", "Accelerometer1RMS", "Accelerometer2RMS", "Current", "Pressure", "Temperature", "Thermocouple", "Volume Flow RateRMS", "Voltage"]:
            values = df[feature]
            threshold = values.mean() + values.std()
            
            if values.max() > threshold * 1.2:  # 🔴 Red: Detected anomaly
                colors[feature] = "red"
            elif values.max() > threshold * 1.05:  # 🟡 Yellow: Potential issue
                colors[feature] = "yellow"
            else:  # 🟢 Green: Normal data
                colors[feature] = "green"

        return colors

    # Sidebar for main navigation
    main_page = st.sidebar.selectbox("Choose a page", ["Attack Generation", "Real Time Anomaly Detection", "Battery Spoofing Detection", "Real Time Graph Visualization"])
    page = main_page
    if main_page == "Attack Generation":
        st.title("🚀 CAN Bus Synthetic Attack Generator 🚀")

        attack_type = st.selectbox("Select Attack Type", ["fuzzy", "spoofing", "replay", "dos"])
        num_samples = st.number_input("Enter Number of Samples to Generate", min_value=1, value=10)

        if st.button("Generate Attack Data"):
            attack_data = generate_attack(attack_type, num_samples)
            attack_df = pd.DataFrame(attack_data)

            st.write("### Generated Attack Data:")
            st.dataframe(attack_df)

            csv = attack_df.to_csv(index=False).encode('utf-8')
            st.download_button(
                label="Download CSV",
                data=csv,
                file_name='attack_data.csv',
                mime='text/csv',
            )

    elif main_page == "Real Time Anomaly Detection":
        st.title("🔍 CAN Bus Anomaly Detection 🔍")
        
        # Subpage selection for Anomaly Detection
        subpage = st.radio("Select Anomaly Detection Mode", ["Input Values", "Real-time Simulation", "LSTM AutoEncoder Anomaly Detection"])
        
        if subpage == "Input Values":
            features = ["datetime", "Accelerometer1RMS", "Accelerometer2RMS", "Current", "Pressure", "Temperature", "Thermocouple", "Volume Flow RateRMS", "Voltage"]
            st.subheader("Input Sensor Values")
            
            # Input fields for sensor values
            datetime = st.number_input("Timestamp", value=0.0)
            acc1 = st.number_input("Accelerometer1RMS", value=0.0)
            acc2 = st.number_input("Accelerometer2RMS", value=0.0)
            current = st.number_input("Current", value=0.0)
            pressure = st.number_input("Pressure", value=0.0)
            temperature = st.number_input("Temperature", value=0.0)
            thermocouple = st.number_input("Thermocouple", value=0.0)
            volume_flow = st.number_input("Volume Flow RateRMS", value=0.0)
            voltage = st.number_input("Voltage", value=0.0)
            
            if st.button("Detect Anomaly"):
                sensor_values = [datetime, acc1, acc2, current, pressure, temperature, thermocouple, volume_flow, voltage]
                prediction, score = detect_anomaly(sensor_values)
                status = "Anomaly" if prediction == 1 else "Normal"
                st.write(f"Anomaly Score: {score:.3f} | Status: {status}")
        
        elif subpage == "Real-time Simulation":
            st.subheader("Real-time Anomaly Detection Simulation")
            st.write("Simulating real-time anomaly detection...")

            if st.button("Start Anomaly Detection Simulation"):
                progress_bar = st.progress(0)
                status_placeholder = st.empty()

                results_container = st.empty()
                all_results = []

                for i, (_, row) in enumerate(df.sample(n=10).iterrows()):
                    values = row[features].tolist()
                    prediction, score = detect_anomaly(values)
                    status = "Anomaly" if prediction == 1 else "Normal"
                    
                    # Color coding
                    background_color = "#FF4B4B" if prediction == 1 else "#4BFF4B"
                    text_color = "white" if prediction == 1 else "black"
                    
                    # Create the result string
                    result = f"""
                    <div style="background-color: {background_color}; padding: 10px; border-radius: 5px; color: {text_color}; margin-bottom: 10px;">
                        Anomaly Score: {score:.3f} | Status: {status}<br>
                        {', '.join([f'{col}: {row[col]:.2f}' for col in features])}
                    </div>
                    """
                    
                    # Add the result to the list
                    all_results.append(result)
                    
                    # Update the container with all results
                    results_container.markdown(''.join(all_results), unsafe_allow_html=True)
                    
                    progress_bar.progress((i + 1) / 10)
                    time.sleep(1)

                st.success("Simulation completed!")
        
        elif subpage == "LSTM AutoEncoder Anomaly Detection":
            # Streamlit App Title
            st.subheader("🔍 LSTM Autoencoder Anomaly Detection")

            # Sidebar for File Uploads and Inputs
            st.sidebar.header("Upload Dataset and Model")
            uploaded_file = 'CAN.csv'
            uploaded_model = 'lstm_autoencoder.h5'
            if uploaded_file and uploaded_model:
                # Load dataset and model
                df = pd.read_csv(uploaded_file)
                model = load_model(uploaded_model, custom_objects={'mse': mse})

                # Select relevant sensor features
                features = [
                    "datetime", "Accelerometer1RMS", "Accelerometer2RMS", "Current", "Pressure",
                    "Temperature", "Thermocouple", "Volume Flow RateRMS"
                ]

                # Convert timestamp to numerical format
                df["datetime"] = pd.to_datetime(df["datetime"]).astype(int) / 10**9  # Convert to seconds

                # Extract feature values
                data = df[features].values

                # Normalize data
                scaler = StandardScaler()
                data_scaled = scaler.fit_transform(data)

                # Compute mean and standard deviation for each feature
                feature_means = np.mean(data_scaled, axis=0)
                feature_stds = np.std(data_scaled, axis=0)

                # Display feature means in Streamlit
                st.subheader("Featurs")
                feature_means_df = pd.DataFrame({
                    "Feature": features,
                    #"Mean": feature_means
                })
                st.write(feature_means_df)

                # Test Data Input (Simulating X_test)
                SEQ_LEN = 10  # Example sequence length for LSTM input
                X_test = []
                
                for i in range(len(data_scaled) - SEQ_LEN):
                    X_test.append(data_scaled[i: i + SEQ_LEN])
                
                X_test = np.array(X_test)

                # Calculate reconstruction error using the loaded model
                st.subheader("Anomaly Detection")
                
                if st.button("Detect Anomalies"):
                    X_test_pred = model.predict(X_test)
                    reconstruction_error = np.mean(np.abs(X_test_pred - X_test), axis=(1, 2))

                    # Set anomaly threshold (95th percentile of reconstruction error)
                    THRESHOLD = np.percentile(reconstruction_error, 95)
                    anomalies = reconstruction_error > THRESHOLD

                    # Display anomaly statistics in Streamlit
                    st.write(f"Total Test Samples: {len(X_test)}")
                    st.write(f"Anomalies Detected: {np.sum(anomalies)}")
                    
                    # Plot anomaly scores as a histogram
                    fig, ax = plt.subplots(figsize=(10, 5))
                    ax.hist(reconstruction_error, bins=50)
                    ax.axvline(THRESHOLD, color='red', linestyle='dashed', label='Anomaly Threshold')
                    ax.set_xlabel("Reconstruction Error")
                    ax.set_ylabel("Frequency")
                    ax.legend()
                    st.pyplot(fig)

                    # Find the time indices of detected anomalies
                    anomaly_indices = np.where(anomalies)[0]

                    # Feature Analysis of Anomalies
                    st.subheader("Feature Analysis of Anomalies")
                    
                    anomaly_details = []
                    
                    for idx in anomaly_indices:
                        seq_data = X_test[idx][-1]  # Last timestep in the sequence
                        
                        # Compute z-scores (how far from mean in standard deviations)
                        z_scores = np.abs((seq_data - feature_means) / feature_stds)

                        # Identify the feature with the highest deviation
                        most_anomalous_feature_idx = np.argmax(z_scores)
                        most_anomalous_feature = features[most_anomalous_feature_idx]
                        max_z_score = z_scores[most_anomalous_feature_idx]

                        anomaly_details.append({
                            "Index": idx,
                            "Most Anomalous Feature": most_anomalous_feature,
                            "Max Z-Score": (max_z_score)
                        })

                    anomaly_df = pd.DataFrame(anomaly_details)
                    st.write(anomaly_df)

            else:
                st.warning("Please upload both a dataset (CSV) and an LSTM Autoencoder model (H5) to proceed.")



    elif main_page == "Battery Spoofing Detection":
        # Anomaly detection setup (keep existing code)
        features = ["datetime","Voltage"]
        st.title("🔍 LSTM-based Voltage Anomaly Detection 🔍")
        
        # Load trained LSTM model and scaler
        @st.cache_resource
        def load_trained_model():
            model = load_model("battery.h5",custom_objects={'mse': mse})  # Load pre-trained model
            with open("scaler.pkl", "rb") as f:
                scaler = pickle.load(f)  # Load pre-trained scaler
            return model, scaler

        # Function to generate attack data (dummy function, replace with actual logic)
        def generate_attack(attack_type, num_samples):
            np.random.seed(42)
            timestamps = pd.date_range("2025-03-01", periods=num_samples, freq="T")
            voltage = np.random.uniform(3.5, 4.2, num_samples)  # Simulated voltage variations
            return {"datetime": timestamps, "Voltage": voltage}

        # Load model and scaler once
        st.session_state.lstm_model, st.session_state.scaler = load_trained_model()

        # Anomaly detection setup
        features = ["datetime", "Voltage"]

        st.subheader("Generate and Detect Voltage Anomalies")
        attack_type = st.selectbox("Select Attack Type", ["fuzzy", "spoofing", "replay", "dos"])
        num_samples = st.number_input("Enter Number of Samples to Generate", min_value=1, value=50, step=1)

        if st.button("Generate and Detect Anomalies"):
            attack_data = generate_attack(attack_type, num_samples)
            attack_df = pd.DataFrame(attack_data)
            
            # Convert datetime to numerical format
            attack_df["datetime"] = pd.to_datetime(attack_df["datetime"]).astype(int) / 10**9
            
            # Normalize data using loaded scaler
            features_to_scale = ["datetime", "Voltage"]
            attack_data_scaled = st.session_state.scaler.transform(attack_df[features_to_scale])
            
            # Reshape for LSTM
            SEQ_LEN = 10
            attack_X = [attack_data_scaled[i : i + SEQ_LEN] for i in range(len(attack_data_scaled) - SEQ_LEN)]
            attack_X = np.array(attack_X)
            
            # Model Prediction
            attack_pred = st.session_state.lstm_model.predict(attack_X, verbose=0)
            attack_reconstruction_error = np.mean(np.abs(attack_pred - attack_X), axis=(1, 2))

            # Compute anomaly threshold dynamically
            THRESHOLD = np.percentile(attack_reconstruction_error, 95)
            
            # Detect anomalies
            attack_anomalies = attack_reconstruction_error > THRESHOLD
            st.write(f"Anomalies Detected: {np.sum(attack_anomalies)} out of {len(attack_anomalies)}")

            # Plot results
            fig, ax = plt.subplots(figsize=(10, 6))
            ax.plot(attack_reconstruction_error, label="Reconstruction Error")
            ax.axhline(y=THRESHOLD, color='r', linestyle='--', label="Anomaly Threshold")
            ax.set_title(f"Reconstruction Error for {attack_type.capitalize()} Attack")
            ax.set_xlabel("Time Steps")
            ax.set_ylabel("Reconstruction Error")
            ax.legend()
            st.pyplot(fig)

            # Show attack data
            st.subheader("Generated Attack Data")
            st.dataframe(attack_df)

    elif main_page == "Real Time Graph Visualization":
        st.title("📊 Real-Time Anomaly Score Visualization")
        st.write("This page generates data from the dataset, calculates anomaly scores, and visualizes them in real-time.")

        # User input: Number of data points to generate
        num_points = st.number_input("Enter the number of data points to visualize:", min_value=1, value=10, step=1)

        # Button to start/stop animation
        if "animation_running" not in st.session_state:
            st.session_state.animation_running = False

        if st.button("Start Animation"):
            st.session_state.animation_running = True

        if st.button("Stop Animation"):
            st.session_state.animation_running = False

        # Placeholder for the animated graph
        graph_placeholder = st.empty()

        # Initialize session state for storing anomaly scores
        if "anomaly_scores" not in st.session_state:
            st.session_state.anomaly_scores = []

        # Function to generate data and calculate anomaly scores
        def generate_and_calculate_anomalies(df, num_points):
            sampled_data = df.sample(n=num_points)  # Randomly sample data points
            scores = []
            for _, row in sampled_data.iterrows():
                sensor_values = row[features].tolist()
                _, anomaly_score = detect_anomaly(sensor_values)  # Calculate anomaly score
                scores.append(anomaly_score)
            return scores

        # Animation loop
        while st.session_state.animation_running:
            # Generate new anomaly scores
            new_scores = generate_and_calculate_anomalies(df, num_points)
            st.session_state.anomaly_scores.extend(new_scores)

            # Create a DataFrame for plotting
            score_df = pd.DataFrame({
                "Index": range(len(st.session_state.anomaly_scores)),
                "Anomaly Score": st.session_state.anomaly_scores
            })

            # Plot the graph using Matplotlib
            fig, ax = plt.subplots()
            ax.plot(score_df["Index"], score_df["Anomaly Score"], marker="o", linestyle="-", color="b")
            ax.set_title("Real-Time Anomaly Scores")
            ax.set_xlabel("Data Point Index")
            ax.set_ylabel("Anomaly Score")
            ax.grid(True)

            # Update the graph in Streamlit
            with graph_placeholder:
                st.pyplot(fig)

            time.sleep(2)  # Wait for 2 seconds before adding new data

        st.write("Click 'Start Animation' to begin or 'Stop Animation' to end.")
