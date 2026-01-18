import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type ErrorBoundaryProps = {
  children: React.ReactNode;
  onReset?: () => void;
};

type ErrorBoundaryState = {
  hasError: boolean;
  errorMessage: string;
};

const initialState: ErrorBoundaryState = {
  hasError: false,
  errorMessage: '',
};

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state = initialState;

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    let errorMessage = 'Something went wrong.';
    if (error instanceof Error && error.message) {
      errorMessage = error.message;
    }

    return {
      hasError: true,
      errorMessage,
    };
  }

  componentDidCatch(error: unknown): void {
    void error;
  }

  private handleReset = () => {
    this.setState(initialState);
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Something went wrong</Text>
        <Text style={styles.message}>{this.state.errorMessage}</Text>
        <Pressable style={styles.button} onPress={this.handleReset}>
          <Text style={styles.buttonText}>Try Again</Text>
        </Pressable>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0E0940',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: '#0E0940',
    textAlign: 'center',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#5631E8',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
