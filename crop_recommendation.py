import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, RandomizedSearchCV
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
import joblib  # For saving and loading the model
import os  # For checking file existence

def load_and_preprocess_data(file_path='crop_recommendation_cleaned.csv'):  # Or 'Crop_recommendation.csv'
    """Loads the dataset and performs initial preprocessing."""
    try:
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"Error: '{file_path}' not found in the current directory: '{os.getcwd()}'")
        df = pd.read_csv(file_path)
        print("Dataset loaded successfully.")
    except FileNotFoundError as e:
        print(e)
        return None, None  # Return None for both df and numerical_features
    except Exception as e:
        print(f"An error occurred during data loading: {e}")
        return None, None

    numerical_features = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
    df = handle_outliers(df, numerical_features)
    return df, numerical_features

def handle_outliers(df, numerical_features):
    """Handles outliers using the IQR method with capping."""
    df_cleaned = df.copy()
    for col in numerical_features:
        Q1 = df_cleaned[col].quantile(0.25)
        Q3 = df_cleaned[col].quantile(0.75)
        IQR = Q3 - Q1
        lower_bound = Q1 - 1.5 * IQR
        upper_bound = Q3 + 1.5 * IQR
        df_cleaned[col] = np.clip(df_cleaned[col], lower_bound, upper_bound)
    return df_cleaned

def prepare_data_for_model(df, numerical_features):
    """Encodes the target variable and scales the numerical features."""
    df_prepared = df.copy()
    label_encoder = LabelEncoder()
    df_prepared['label_encoded'] = label_encoder.fit_transform(df_prepared['label'])

    scaler = StandardScaler()
    df_prepared[numerical_features] = scaler.fit_transform(df_prepared[numerical_features])

    return df_prepared, label_encoder, scaler

def split_data(df_prepared):
    """Splits the data into training and testing sets."""
    X = df_prepared.drop(['label', 'label_encoded'], axis=1)
    y = df_prepared['label_encoded']
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    return X_train, X_test, y_train, y_test

def train_random_forest(X_train, y_train):
    """Trains a Random Forest classifier using RandomizedSearchCV."""
    param_grid = {
        'n_estimators': [100, 200, 300],
        'max_depth': [None, 10, 20],
        'min_samples_split': [2, 5],
        'min_samples_leaf': [1, 2],
        'criterion': ['gini', 'entropy']
    }
    rf_model = RandomForestClassifier(random_state=42, n_jobs=-1)
    random_search = RandomizedSearchCV(
        estimator=rf_model,
        param_distributions=param_grid,
        n_iter=10,
        scoring='accuracy',
        cv=3,
        random_state=42,
        n_jobs=-1,
        verbose=0
    )
    random_search.fit(X_train, y_train)
    best_rf_model = RandomForestClassifier(**random_search.best_params_, random_state=42, n_jobs=-1)
    best_rf_model.fit(X_train, y_train)
    return best_rf_model

def evaluate_model(model, X_test, y_test, label_encoder):
    """Evaluates the trained model on the test set."""
    y_pred_test = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred_test)
    precision = precision_score(y_test, y_pred_test, average='weighted', zero_division=0)
    recall = recall_score(y_test, y_pred_test, average='weighted', zero_division=0)
    f1 = f1_score(y_test, y_pred_test, average='weighted', zero_division=0)

    print("\n--- Model Evaluation on Test Set ---")
    print(f"Accuracy: {accuracy:.4f}")
    print(f"Precision: {precision:.4f}")
    print(f"Recall: {recall:.4f}")
    print(f"F1-score: {f1:.4f}")

def get_user_input(numerical_features):
    """Gets crop parameters from the user with input validation."""

    # Define reasonable ranges for the features (these should be adjusted based on your knowledge)
    feature_ranges = {
        'N': (0, 200),  # Example: 0-200 kg/ha
        'P': (0, 100),  # Example: 0-100 kg/ha
        'K': (0, 200),  # Example: 0-200 kg/ha
        'temperature': (0, 50),  # Example: 0-50 degrees Celsius
        'humidity': (0, 100),  # Example: 0-100%
        'ph': (4, 9),  # Example: 4-9 pH range
        'rainfall': (0, 500),  # Example: 0-500 mm
    }

    user_input = {}
    for feature in numerical_features:
        min_val, max_val = feature_ranges[feature]
        while True:
            try:
                value = float(input(f"Enter {feature} ({min_val:.2f} - {max_val:.2f}): "))
                if min_val <= value <= max_val:
                    user_input[feature] = value
                    break
                else:
                    print(f"Invalid input. {feature} must be between {min_val:.2f} and {max_val:.2f}.")
            except ValueError:
                print("Invalid input. Please enter a numerical value.")
    return pd.DataFrame([user_input])

def predict_crop(model, scaler, label_encoder, user_data):
    """Predicts the crop type based on user input."""

    # Clip user input to the feature ranges (optional but recommended for robustness)
    feature_ranges = {
        'N': (0, 200),
        'P': (0, 100),
        'K': (0, 200),
        'temperature': (0, 50),
        'humidity': (0, 100),
        'ph': (4, 9),
        'rainfall': (0, 500),
    }
    for feature, (min_val, max_val) in feature_ranges.items():
        user_data[feature] = np.clip(user_data[feature], min_val, max_val)

    user_data_scaled = scaler.transform(user_data)
    prediction = model.predict(user_data_scaled)
    predicted_crop = label_encoder.inverse_transform(prediction)[0]
    return predicted_crop

def main():
    """Main function to orchestrate the crop recommendation process."""

    # --- CHANGE THIS LINE BELOW ---
    file_path = 'crop_recommendion/crop_recommendation_cleaned.csv'
    # --- CHANGE THIS LINE ABOVE ---

    numerical_features = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
    model_filename = 'crop_recommendation_model.joblib'
    scaler_filename = 'crop_recommendation_scaler.joblib'
    label_encoder_filename = 'crop_recommendation_label_encoder.joblib'

    # --- Load or Train the Model ---
    try:
        # Try to load saved model components
        model = joblib.load(model_filename)
        scaler = joblib.load(scaler_filename)
        label_encoder = joblib.load(label_encoder_filename)
        print("Loaded saved model and associated files.")

    except FileNotFoundError:
        # If any of the files are missing, train the model
        print("Saved model files not found. Training a new model.")
        df, numerical_features = load_and_preprocess_data(file_path)
        if df is None:
            print("Data loading failed. Please ensure the CSV file is in the correct directory.")
            return  # Exit if data loading failed

        df_cleaned = handle_outliers(df, numerical_features)
        df_prepared, label_encoder, scaler = prepare_data_for_model(df_cleaned, numerical_features)
        X_train, X_test, y_train, y_test = split_data(df_prepared)
        model = train_random_forest(X_train, y_train)
        evaluate_model(model, X_test, y_test, label_encoder)

        # Save the trained model components
        joblib.dump(model, model_filename)
        joblib.dump(scaler, scaler_filename)
        joblib.dump(label_encoder, label_encoder_filename)
        print("Trained and saved model and associated files.")

    except Exception as e:
        # Handle other potential errors during loading
        print(f"An error occurred during model loading: {e}")
        return  # Exit if there's an error

    # --- Get User Input and Predict ---
    user_data = get_user_input(numerical_features)
    predicted_crop = predict_crop(model, scaler, label_encoder, user_data)
    print(f"\nPredicted crop: {predicted_crop}")

if __name__ == "__main__":
    main()