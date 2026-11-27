#eval 2 + 2

def lipatDua (n : Nat) : Nat := n * 2
#eval lipatDua 21

theorem dua_tambah_dua : 2 + 2 = 4 := rfl

theorem tukar (p q : Prop) : p ∧ q → q ∧ p := by
  intro h
  constructor
  · exact h.right
  · exact h.left

theorem tambah_tukar (a b : Nat) : a + b = b + a := by
  rw [Nat.add_comm]

theorem mustahil : 2 + 2 = 5 := by
  sorry

#print axioms mustahil
#print axioms tukar
