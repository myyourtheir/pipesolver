class Stack:
    def __init__(self):
        self.stack: list[str] = []

    def add(self, element_id: str):
        self.stack.append(element_id)

    def remove(self):
        return self.stack.pop()

    def head(self):
        return self.stack[-1]

    def is_empty(self):
        return True if len(self.stack) == 0 else False

    def __len__(self):
        return len(self.stack)
